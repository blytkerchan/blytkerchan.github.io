import useToken from "../lib/useToken";
import Login from "../components/Login";

const Dashboard = (props) => {
  const { token, setToken } = useToken();

  if (!token) {
    return (
      <>
        <Login setToken={setToken} />
        You need to log in to see this ¯\_(ツ)_/¯
      </>
    );
  } else {
    return <>Dashboard</>;
  }
};

export default Dashboard;
