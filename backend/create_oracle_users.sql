-- ============================================================================
-- MyComplaintPortal — Oracle Database User Creation Script
-- Supports Oracle 12c, 19c, 21c, and 23c (CDB/PDB & XE)
-- Run as SYSDBA or SYSTEM in SQL*Plus / SQL Developer
-- ============================================================================

-- Allow non-C## user creation in Container DB (XE / ORCL)
ALTER SESSION SET "_ORACLE_SCRIPT"=true;

-- 1. CREATE USER FOR AUTH SERVICE (auth-service)
CREATE USER auth_db IDENTIFIED BY authpassword;
GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO auth_db;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW, CREATE PROCEDURE TO auth_db;

-- 2. CREATE USER FOR USER SERVICE (user-service)
CREATE USER user_db IDENTIFIED BY userpassword;
GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO user_db;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW, CREATE PROCEDURE TO user_db;

-- 3. CREATE USER FOR COMPLAINT SERVICE (complaint-service)
CREATE USER complaint_db IDENTIFIED BY complaintpassword;
GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO complaint_db;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW, CREATE PROCEDURE TO complaint_db;

-- 4. CREATE USER FOR DEPARTMENT ADMIN SERVICE (department-admin-service)
CREATE USER deptadmin_db IDENTIFIED BY deptadminpassword;
GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO deptadmin_db;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW, CREATE PROCEDURE TO deptadmin_db;

-- 5. UNIFIED SINGLE SCHEMA USER (FOR MONOLITH / SINGLE DB OPTION)
CREATE USER c##mycomplaintportal IDENTIFIED BY "MyComplaintPortalPass123!";
GRANT CONNECT, RESOURCE, UNLIMITED TABLESPACE TO c##mycomplaintportal;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE VIEW, CREATE PROCEDURE TO c##mycomplaintportal;

COMMIT;

-- Verify Created Users
SELECT username, account_status, created FROM all_users 
WHERE username IN ('AUTH_DB', 'USER_DB', 'COMPLAINT_DB', 'DEPTADMIN_DB', 'C##MYCOMPLAINTPORTAL');
