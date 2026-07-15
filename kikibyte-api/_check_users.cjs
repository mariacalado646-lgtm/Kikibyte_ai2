const { Sequelize } = require('sequelize');
const s = new Sequelize('postgresql://projeto:projeto123@100.105.58.22:5434/projeto2', {
  dialect: 'postgres', logging: false, dialectOptions: { ssl: false }
});
(async () => {
  const [users] = await s.query("SELECT id_utilizador, nome, email, role_id, password_hash FROM utilizador ORDER BY id_utilizador");
  console.log(JSON.stringify(users, null, 2));
  await s.close();
})();
