import bcrypt from 'bcrypt';

const password = 'Test123456';
const hash = await bcrypt.hash(password, 10);
console.log('Hash generado:', hash);