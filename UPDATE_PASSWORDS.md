# Password Reset Instructions

## New Password for All Test Accounts
**Password:** `Test010`

## Option 1: Using Prisma Studio (EASIEST)

Since you already have Prisma Studio running (`npx prisma studio`), follow these steps:

1. Open Prisma Studio in your browser (usually http://localhost:5555)
2. Click on the **User** model/table
3. For each user (test01, test02, test03, etc.), click on the row and edit the `passwordHash` field
4. Replace the old hash with this new hash:
   ```
   $2a$10$uet2z4ZPJDkgiz7Swfi.LO2/K2J3P12QC779IW7iaU0IPUPBrZ1vG
   ```
5. Click Save for each user

## Option 2: Direct SQL Query

Run this SQL query in your database client:

```sql
UPDATE "User" 
SET "passwordHash" = '$2a$10$uet2z4ZPJDkgiz7Swfi.LO2/K2J3P12QC779IW7iaU0IPUPBrZ1vG'
WHERE username IN ('test01', 'test02', 'test03', 'test04', 'test05', 'test06', 'test07', 'test08', 'test09', 'test10');
```

## Verify

After updating, you can log in to any test account using:
- **Username:** test01 (or test02, test03, etc.)
- **Password:** Test010

---

**Note:** The hash `$2a$10$uet2z4ZPJDkgiz7Swfi.LO2/K2J3P12QC779IW7iaU0IPUPBrZ1vG` is the bcrypt hash of the password "Test010" with a salt round of 10.
