import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { complaintsApi, deptAdminApi, usersApi, authApi, aiApi, imagesApi } from '../api/apiClient';
import { useAuth } from './AuthContext.jsx';

const ComplaintContext = createContext(undefined);

export const sortComplaintsByLocationAndPriority = (complaintsList, targetPincode) => {
  if (!Array.isArray(complaintsList)) return [];
  let cleanPincode = '';
  if (targetPincode) {
    const match = String(targetPincode).match(/\b\d{6}\b/);
    cleanPincode = match ? match[0] : String(targetPincode).trim();
  }

  return [...complaintsList].sort((a, b) => {
    const aPincode = (a.pincode || '').trim();
    const bPincode = (b.pincode || '').trim();

    const aSamePincode = cleanPincode && aPincode && (aPincode === cleanPincode || aPincode.includes(cleanPincode)) ? 1 : 0;
    const bSamePincode = cleanPincode && bPincode && (bPincode === cleanPincode || bPincode.includes(cleanPincode)) ? 1 : 0;

    if (aSamePincode !== bSamePincode) {
      return bSamePincode - aSamePincode;
    }

    const aUnresolved = (a.status !== 'RESOLVED' && a.status !== 'Resolved') ? 1 : 0;
    const bUnresolved = (b.status !== 'RESOLVED' && b.status !== 'Resolved') ? 1 : 0;

    if (aUnresolved !== bUnresolved) {
      return bUnresolved - aUnresolved;
    }

    const aScore = (a.upvotes || 0) * 2 + (a.reposts || 0) * 3;
    const bScore = (b.upvotes || 0) * 2 + (b.reposts || 0) * 3;
    if (aScore !== bScore) {
      return bScore - aScore;
    }

    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
};

export const ComplaintProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePincode, setActivePincode] = useState('641004');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  const normalizeComplaint = useCallback((c) => ({
    id: c.complaintId || c.id,
    complaintId: c.complaintId || c.id,
    title: c.title || 'Civic Grievance',
    description: c.description || '',
    pincode: c.pincode || '641004',
    locationName: c.locationName || 'Coimbatore',
    departmentId: c.departmentId || 'dept-pwd',
    departmentName: c.departmentName || 'Public Works Department',
    officerEmail: c.officerEmail || '',
    status: c.status || 'REGISTERED',
    upvotes: c.upvotes || 0,
    reposts: c.reposts || 0,
    userUpvoted: user ? (c.upvotedByUsers || []).some(id => 
      (user.id && String(id).toLowerCase() === String(user.id).toLowerCase()) || 
      (user.email && String(id).toLowerCase() === String(user.email).toLowerCase())
    ) : false,
    userReposted: user ? (c.repostedByUsers || []).some(id => 
      (user.id && String(id).toLowerCase() === String(user.id).toLowerCase()) || 
      (user.email && String(id).toLowerCase() === String(user.email).toLowerCase())
    ) : false,
    userReported: user ? (c.reportedByUsers || []).some(id => 
      (user.id && String(id).toLowerCase() === String(user.id).toLowerCase()) || 
      (user.email && String(id).toLowerCase() === String(user.email).toLowerCase())
    ) : false,
    reported: c.reported || false,
    reportCount: c.reportCount || 0,
    userId: c.userId || '',
    userName: c.userName || 'Anonymous',
    trackingToken: c.trackingToken || '',
    proofImageId: c.proofImageId || '',
    officerNotes: c.officerNotes || '',
    attachmentImageIds: c.attachmentImageIds || [],
    feedback: (c.feedbackRating || c.feedbackComment) ? {
      rating: c.feedbackRating || c.feedback?.rating || 5,
      comment: c.feedbackComment || c.feedback?.comment || '',
      date: c.feedbackDate ? String(c.feedbackDate).split('T')[0] : (c.feedback?.date || ''),
    } : (c.feedback || null),
    images: (c.attachmentImageIds && c.attachmentImageIds.length > 0)
      ? c.attachmentImageIds.map(id => imagesApi.getImageUrl(id))
      : ((c.images && c.images.length > 0)
          ? c.images.map(img => imagesApi.getImageUrl(img))
          : (c.proofImageId ? [imagesApi.getImageUrl(c.proofImageId)] : undefined)),
    createdAt: c.createdAt || c.postedDate || null,
    resolvedAt: c.resolvedAt || c.resolvedDate || null,
  }), [user?.id]);

  const [dbStats, setDbStats] = useState(null);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [complaintsData, deptData, usersData, adminData, statsData] = await Promise.allSettled([
        complaintsApi.getAll(),
        deptAdminApi.getDepartments(),
        usersApi.getAll(),
        deptAdminApi.getAdmins(),
        complaintsApi.getStats(),
      ]);

      if (complaintsData.status === 'fulfilled' && Array.isArray(complaintsData.value)) {
        setComplaints(complaintsData.value.map(normalizeComplaint));
      }
      if (deptData.status === 'fulfilled' && Array.isArray(deptData.value)) {
        setDepartments(deptData.value);
      }

      const usersList = (usersData.status === 'fulfilled' && Array.isArray(usersData.value)) ? usersData.value : [];
      const citizenOnlyList = usersList.filter(
        (u) =>
          (!u.role || u.role === 'CITIZEN') &&
          u.email?.toLowerCase() !== 'jaisurya7482@gmail.com' &&
          !u.email?.includes('@citizen.portal')
      );

      setUsers(citizenOnlyList);

      if (adminData.status === 'fulfilled' && Array.isArray(adminData.value)) {
        setAdmins(adminData.value);
      }

      if (statsData.status === 'fulfilled' && statsData.value) {
        setDbStats(statsData.value);
      }
    } catch (e) {
      console.error('Error loading data from backend:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const toggleUpvote = async (complaintId) => {
    try {
      const identifier = user?.id || user?.email;
      if (!identifier) return;
      const updated = await complaintsApi.toggleUpvote(complaintId, identifier);
      if (updated) {
        setComplaints((prev) => prev.map((c) => (c.id === complaintId ? normalizeComplaint(updated) : c)));
      }
    } catch (e) {
      console.error('Failed upvote:', e);
    }
  };

  const toggleRepost = async (complaintId, reason) => {
    try {
      const identifier = user?.id || user?.email;
      if (!identifier) return;
      const updated = await complaintsApi.toggleRepost(complaintId, identifier);
      if (updated) {
        setComplaints((prev) => prev.map((c) => (c.id === complaintId ? normalizeComplaint(updated) : c)));
      }
    } catch (e) {
      console.error('Failed repost:', e);
    }
  };

  const reportComplaint = async (complaintId, reason) => {
    try {
      const identifier = user?.id || user?.email;
      if (!identifier) return;
      const updated = await complaintsApi.report(complaintId, reason, identifier);
      if (updated) {
        setComplaints((prev) => prev.map((c) => (c.id === complaintId ? normalizeComplaint(updated) : c)));
      }
    } catch (e) {
      console.error('Failed report:', e);
    }
  };

  const cycleStatus = async (complaintId) => {
    try {
      const updated = await complaintsApi.cycleStatus(complaintId);
      if (updated) {
        setComplaints((prev) => prev.map((c) => (c.id === complaintId ? normalizeComplaint(updated) : c)));
      }
    } catch (e) {
      console.error('Failed cycleStatus:', e);
    }
  };

  const deleteComplaint = async (complaintId) => {
    try {
      await complaintsApi.delete(complaintId);
      setComplaints((prev) => prev.filter((c) => c.id !== complaintId));
    } catch (e) {
      console.error('Failed deleteComplaint:', e);
    }
  };

  const checkDuplicateComplaint = async (description, pincode, departmentId, locationName, images = []) => {
    try {
      const res = await complaintsApi.checkDuplicate({
        description,
        pincode,
        departmentId,
        locationName,
        images,
      });
      return res;
    } catch (e) {
      console.warn('Backend AI check duplicate error:', e);
      return {
        candidateGrievances: [],
        aiResult: {
          existingComplaintFound: false,
          matchType: 'NO_MATCH',
          confidence: 0.9,
          reason: 'No active unresolved grievances found.',
        },
      };
    }
  };

  const classifyDepartment = async (description, images = []) => {
    try {
      const res = await aiApi.classify(description, images);
      return res;
    } catch (e) {
      console.warn('AI Department Classification fallback:', e);
      return null;
    }
  };

  const addComplaint = async (newComplaintData) => {
    const desc = (newComplaintData.description || '').trim();
    const shortDesc = desc.length > 80 ? desc.slice(0, 77) + '...' : desc;
    const computedTitle = newComplaintData.title || shortDesc || `${newComplaintData.departmentName || 'Civic'} Grievance`;

    const cleanAttachmentIds = (newComplaintData.attachmentImageIds || []).filter(
      (id) => id && typeof id === 'string' && !id.startsWith('data:')
    );

    const postPayload = {
      title: computedTitle,
      description: desc || 'Grievance registered from frontend portal.',
      pincode: newComplaintData.pincode || '641004',
      locationName: (newComplaintData.address || newComplaintData.locationName || 'Coimbatore').slice(0, 250),
      departmentId: newComplaintData.departmentId || 'dept-pwd',
      departmentName: newComplaintData.departmentName || 'Public Works Department (PWD)',
      attachmentImageIds: cleanAttachmentIds,
      officerEmail: newComplaintData.officerEmail || '',
      userId: newComplaintData.userId || user?.id || 'usr-citizen',
      userName: newComplaintData.userName || user?.name || 'Citizen',
      aiMatchedGrievanceId: newComplaintData.aiMatchedGrievanceId || null,
      aiMatchType: newComplaintData.aiMatchType || null,
    };

    try {
      const created = await complaintsApi.create(postPayload);
      const normalized = normalizeComplaint(created);
      setComplaints((prev) => [normalized, ...prev]);
      return normalized;
    } catch (e) {
      console.warn('Backend addComplaint returned error, applying local persistent registration:', e);
      const localId = `c${Date.now()}`;
      const fallbackData = {
        id: localId,
        complaintId: localId,
        title: postPayload.title,
        description: postPayload.description,
        pincode: postPayload.pincode,
        locationName: postPayload.locationName,
        departmentId: postPayload.departmentId,
        departmentName: postPayload.departmentName,
        officerEmail: postPayload.officerEmail,
        status: 'REGISTERED',
        upvotes: 0,
        reposts: 0,
        userId: postPayload.userId,
        userName: postPayload.userName,
        userEmail: newComplaintData.userEmail || '',
        trackingToken: `trk-${Date.now()}`,
        attachmentImageIds: cleanAttachmentIds,
        images: newComplaintData.images || [],
        createdAt: new Date().toISOString(),
      };
      const normalized = normalizeComplaint(fallbackData);
      setComplaints((prev) => [normalized, ...prev]);
      return normalized;
    }
  };

  const addFeedback = async (complaintId, rating, comment) => {
    try {
      const updated = await complaintsApi.addFeedback(complaintId, rating, comment);
      if (updated) {
        setComplaints((prev) => prev.map((c) => (c.id === complaintId ? normalizeComplaint(updated) : c)));
      }
    } catch (e) {
      console.error('Failed addFeedback:', e);
    }
  };

  // const addDepartment = async (name, email, description) => {
  //   try {
  //     const created = await deptAdminApi.createDepartment({ name, email, description });
  //     if (created) {
  //       setDepartments((prev) => [...prev, created]);
  //     }
  //   } catch (e) {
  //     console.error('Failed addDepartment:', e);
  //   }
  // };
const addDepartment = async (name, code, email, description) => {
  try {
    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      officialEmail: email.trim(),
      description: description?.trim() || '',
      active: true,
      totalCount: 0,
      solvedCount: 0,
      pendingCount: 0,
    };

    console.log('Creating department payload:', payload);

    const created = await deptAdminApi.createDepartment(payload);

    console.log('Department created successfully:', created);

    if (!created) {
      throw new Error('Backend returned empty response');
    }

    setDepartments((prev) => [...prev, created]);

    return created;

  } catch (error) {
    console.error('Failed addDepartment:', error);
    throw error;
  }
};
  // const updateDepartment = async (deptId, updatedFields) => {
  //   try {
  //     const updated = await deptAdminApi.updateDepartment(deptId, updatedFields);
  //     if (updated) {
  //       setDepartments((prev) => prev.map((d) => (d.id === deptId ? updated : d)));
  //     }
  //   } catch (e) {
  //     console.error('Failed updateDepartment:', e);
  //   }
  // };
const updateDepartment = async (deptId, updatedFields) => {
  try {
    console.log("Updating department:", deptId);
    console.log("Payload:", updatedFields);

    const updated = await deptAdminApi.updateDepartment(
      deptId,
      updatedFields
    );

    console.log("Backend response:", updated);

    if (!updated) {
      throw new Error("Backend returned empty response");
    }

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === deptId ? updated : d
      )
    );

    return updated;

  } catch (error) {
    console.error("Failed updateDepartment:", error);
    throw error;
  }
};
  const deleteDepartment = async (deptId) => {
    try {
      await deptAdminApi.deleteDepartment(deptId);
      setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    } catch (e) {
      console.error('Failed deleteDepartment:', e);
    }
  };

  const addAdmin = async (username, email, grantLevel, password) => {
    const roleStr = (grantLevel && grantLevel.toLowerCase().includes('super')) ? 'SUPER_ADMIN' : 'DEPARTMENT_ADMIN';
    const newAdminObj = {
      id: `adm-${Date.now()}`,
      username: username || email.split('@')[0],
      email: email,
      grantLevel: grantLevel || 'Department Admin',
      role: roleStr,
      password: password || 'ksjaisurya',
    };

    try {
      const created = await deptAdminApi.createAdmin({
        username: newAdminObj.username,
        email: newAdminObj.email,
        grantLevel: newAdminObj.grantLevel,
        role: newAdminObj.role,
        password: newAdminObj.password,
      });

      const finalAdmin = created || newAdminObj;
      setAdmins((prev) => [...prev.filter((a) => a.email !== newAdminObj.email), finalAdmin]);
      return finalAdmin;
    } catch (e) {
      console.error('Admin creation failed:', e);
      throw e;
    }
  };

  const updateAdmin = async (adminId, updatedFields) => {
    try {
      const updated = await deptAdminApi.updateAdmin(adminId, updatedFields);
      if (updated) {
        setAdmins((prev) => prev.map((a) => (a.id === adminId ? updated : a)));
      }
    } catch (e) {
      console.error('Failed updateAdmin:', e);
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      await deptAdminApi.deleteAdmin(adminId, user?.email);
      setAdmins((prev) => prev.filter((a) => a.id !== adminId && a.email !== adminId));
    } catch (e) {
      console.error('Failed deleteAdmin:', e);
      throw e;
    }
  };

  const toggleUserBlocked = async (userId) => {
    try {
      const updated = await usersApi.toggleBlock(userId);
      setUsers((prev) => prev.map((u) => {
        if (u.id === userId || u.userId === userId || u.email === userId) {
          return { ...u, blocked: updated?.blocked ?? !u.blocked };
        }
        return u;
      }));
    } catch (e) {
      console.error('Failed toggleUserBlocked:', e);
      setUsers((prev) => prev.map((u) => {
        if (u.id === userId || u.userId === userId || u.email === userId) {
          return { ...u, blocked: !u.blocked };
        }
        return u;
      }));
    }
  };

  const deleteUser = async (userId) => {
    try {
      await usersApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId && u.userId !== userId && u.email !== userId));
    } catch (e) {
      console.error('Failed deleteUser:', e);
      setUsers((prev) => prev.filter((u) => u.id !== userId && u.userId !== userId && u.email !== userId));
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        departments,
        users,
        admins,
        dbStats,
        loading,
        refreshAll,
        activePincode,
        setActivePincode,
        selectedDeptFilter,
        setSelectedDeptFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,
        selectedDateFilter,
        setSelectedDateFilter,
        toggleUpvote,
        toggleRepost,
        reportComplaint,
        cycleStatus,
        deleteComplaint,
        checkDuplicateComplaint,
        classifyDepartment,
        addComplaint,
        addFeedback,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addAdmin,
        updateAdmin,
        deleteAdmin,
        toggleUserBlocked,
        deleteUser,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
