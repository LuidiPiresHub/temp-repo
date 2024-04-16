import axios, { AxiosError } from 'axios';

export default function App() {
  const api = axios.create({
    baseURL: import.meta.env.API_URL || 'http://localhost:3001',
    // withCredentials: true
  });

  const createCookie = async () => {
    try {
      const info = { user: { name: 'user', value: 'John Doe' }, rememberMe: true };
      const { data } = await api.post('/create-cookie', info);
      console.log(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const deleteCookie = async () => {
    try {
      const { data } = await api.get('/delete-cookie');
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
      const { data } = await api.get('/checkout');
      console.log(data);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        console.log({ message: 'https://url-de-login.com' });
      } else {
        console.error('Erro:', error);
      }
    }
  };

  const hello = async () => {
    try {
      const { data } = await api.get('/');
      console.log(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <>
      <button type='button' onClick={createCookie}>Criar Cookie</button>
      <button type='button' onClick={deleteCookie}>Deletar Cookie</button>
      <button type='button' onClick={checkout}>Checkout</button>
      <button type='button' onClick={hello}>Hello</button>
    </>
  )
}
