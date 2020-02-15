import User from '../models/User';

class UserController {
  // Funciona como um middleware, aqui fica o stores de todos os usuários
  async store(req, res) {
    // verificando se já existe um email igual na tabela
    const UserExists = await User.findOne({ where: { email: req.body.email } });

    if (UserExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    // criando um novo usuário (dados que enviaremos pro front end)
    const { id, name, email, provider } = await User.create(req.body);
    // retornando o usuário (retornando objeto com as informações escolhidas)
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // classe para alterar informações sobre o usuário
  async update(req, res) {
    const { email, oldPassword } = req.body;
    // procurando o usuário através da sua chave primaria
    const user = await User.findByPk(req.userId);
    // verificando se o novo email ja existe
    if (email && email !== user.email) {
      const UserExists = await User.findOne({ where: { email } });
      if (UserExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }
    // verificando se o password informado pelo usuário bate
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // realizando o update
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
