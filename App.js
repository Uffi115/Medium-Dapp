import { Routes, Route } from "react-router-dom";
import NewStory from "./pages/NewStory";
import MyBlogs from "./pages/MyBlogs";
import Blog from "./components/Blog";
import Sidebar from "./components/Sidebar";
import HomeAuth from "./pages/HomeAuth";
import Rightbar from "./components/Rightbar";
import "./App.css";
import { ConnectButton } from "web3uikit";
// import logo from "./images/medium.png";
import logo from "./images/chaincentive.png";
import { useMoralis } from "react-moralis";

//neu 2 importe wegen self host server Änderung alles bis vor return
import Moralis from "moralis-v1";
import { useState } from "react";

const App = () => {
  const { isAuthenticated } = useMoralis(); 

  //jetzt wegen self hosted server:
  const { authenticate, enableWeb3 } = useMoralis();
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = async (provider) => {
    try {
      setAuthError(null);
      setIsAuthenticating(true);

      // Enable web3 to get user address and chain
      await enableWeb3({ throwOnError: true, provider });
      const { account, chainId } = Moralis;

      if (!account) {
        throw new Error('Connecting to chain failed, as no connected account was found');
      }
      if (!chainId) {
        throw new Error('Connecting to chain failed, as no connected chain was found');
      }

      // Get message to sign from the auth api
      const { message } = await Moralis.Cloud.run('requestMessage', {
        address: account,
        chain: parseInt(chainId, '16'), //vorher 16
        // chainId: '1',
        network: 'Mumbai Testnet',
      });

      // Authenticate and login via parse
      await authenticate({
        signingMessage: message,
        throwOnError: true,
      });
    } catch (error) {
      setAuthError(error);
    } finally {
      setIsAuthenticating(false);
    }
  };


  return (
    <>

{isAuthenticated ? (
        <div className="App">
          <div className="sideBar">
            <Sidebar />
          </div>
          <div className="mainWindow">
            <Routes>
              <Route path="/" element={<HomeAuth />} />
              <Route path="/newStory" element={<NewStory />} />
              <Route path="/myBlogs" element={<MyBlogs />} />
              <Route path="/blog/:url" element={<Blog />} />
            </Routes>
          </div>
          <div className="rightBar">
            <Rightbar />
          </div>
        </div>
   ) : (
    <div className="unAuth">
        {/* <img src={logo} alt= "logo" height="200px"/> */}
        <img src={logo} alt= "logo" height="300px" />
        {/* <ConnectButton  />   */}
        <button onClick={() => handleAuth("metamask")}>Authenticate via metamask</button>
    </div>

  )}
  </>
);
};
export default App;
