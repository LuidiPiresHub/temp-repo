import axios, { AxiosError } from 'axios';

export default function App() {
  const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
  });

  const createCookie = async () => {
    try {
      const info = { user: { name: 'user', value: 'John Doe' }, rememberMe: true };
      const { data } = await api.post('http://localhost:3001/create-cookie', info);
      console.log(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const deleteCookie = async () => {
    try {
      const { data } = await api.get('http://localhost:3001/delete-cookie');
      console.log(data);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        console.log({ message: 'O Token já foi deletado' });
      } else {
        console.error('Erro:', error);
      }
    }
  };

  const checkout = async () => {
    try {
      const { data } = await api.get('http://localhost:3001/checkout');
      console.log(data);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        console.log({ message: 'https://url-de-login.com' });
      } else {
        console.error('Erro:', error);
      }
    }
  }

  return (
    <>
      <button type='button' onClick={createCookie}>Criar Cookie</button>
      <button type='button' onClick={deleteCookie}>Deletar Cookie</button>
      <button type='button' onClick={checkout}>Checkout</button>
    </>
  )
}
