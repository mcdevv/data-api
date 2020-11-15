import Model from '../models/model';

const messagesModel = new Model('messages');

export const messagesPage = async (req, res) => {
  try {
    console.log('about to query messages');
    const data = await messagesModel.select('name, message');
    console.log('done query messages');
    res.status(200).json({ messages: data.rows });
  } catch (err) {
    res.status(200).json({ messages: err.stack });
  }
};
/* 
export const addMessage = async (req, res) => {
  const { name, message } = req.body;
  const columns = 'name, message';
  const values = `'${name}', '${message}'`;
  try {
    const data = await messagesModel.insertWithReturn(columns, values);
    res.status(200).json({ messages: data.rows });
  } catch (err) {
    res.status(200).json({ messages: err.stack });
  }
}; */
