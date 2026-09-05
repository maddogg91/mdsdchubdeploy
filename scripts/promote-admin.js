// One-time bootstrap script: promotes an existing user account to Admin.
//
// There's no UI path to create the first Admin account -- registration
// always creates a "customer" account, and the /admin contractor-creation
// page is itself gated behind already being an Admin. Run this once,
// against an account you've already registered normally, to seed the
// first Admin:
//
//   node -r dotenv/config scripts/promote-admin.js you@maddoggsoftware.com
//
// Needs the same USE/PASS Mongo credentials as the main app (via .env or
// the environment), since it reuses mongoinfo.js's connection.

require('dotenv').config();
const db = require('../mongoinfo.js');

const email = process.argv[2];

if (!email) {
  console.error('Usage: node -r dotenv/config scripts/promote-admin.js <email>');
  process.exit(1);
}

db.promoteToAdmin(email)
  .then((found) => {
    if (found) {
      console.log(`${email} is now an Admin. Log in normally at /login to reach /admin.`);
    } else {
      console.error(`No account found for ${email}. Register the account first, then run this again.`);
    }
    process.exit(found ? 0 : 1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
