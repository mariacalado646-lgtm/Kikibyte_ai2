const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const s = new Sequelize('postgresql://projeto:projeto123@100.105.58.22:5434/projeto2', {
  dialect: 'postgres', logging: false, dialectOptions: { ssl: false }
});
(async () => {
  const [users] = await s.query("SELECT id_utilizador, nome, email, role_id, password_hash FROM utilizador WHERE ativo=true ORDER BY id_utilizador");
  
  // Testar passwords comuns
  const passwords = ['123456', 'password', 'admin123', 'kikibyte', 'kikibyte2024', 'kikibyte2025', 'cliente123', 'kikibyte123', '123', 'teste', 'password123'];
  
  for (const u of users) {
    for (const p of passwords) {
      if (bcrypt.compareSync(p, u.password_hash)) {
        console.log(`${u.email} (role=${u.role_id}) → password: "${p}"`);
        break;
      }
    }
  }
  await s.close();
})();
