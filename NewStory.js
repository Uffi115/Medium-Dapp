import { useState } from "react";
import "./NewStory.css"
import {
  useMoralisFile,
  useMoralis,
  useWeb3ExecuteFunction,
} from "react-moralis";

//neu import wegen self host server Änderung alles bis vor return
import Moralis from "moralis-v1";
// import Moralis from "moralis";  //habs hier geändert


const NewStory = () => {

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { saveFile } = useMoralisFile();
  const { Moralis, account } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();


  //neu jetzt wegen self hosted server:
  const { authenticate, enableWeb3 } = useMoralis();
  const [authError, setAuthError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const handleAuth = async (provider) => {
    try {
      setAuthError(null);
      setIsAuthenticating(true);

  //     // Enable web3 to get user address and chain
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


  const mint = async (account, uri, provider)  => { //habe hier oben account rausgenommen
     
      // Enable web3 to get user address and chain
      await enableWeb3({ throwOnError: true, provider });
      const { account: newVariableName, chainId } = Moralis;
      // const { account: newVariableName, chainId } = useMoralis();

      // if (!account) {
      //   throw new Error('Connecting to chain failed, as no connected account was found');
      // }
      // if (!chainId) {
      //   throw new Error('Connecting to chain failed, as no connected chain was found');
      // }  

    let options ={
      contractAddress: "0x2fAB8F1113b1C14A25E9e018510B58bE7882CFB6",
      functionName: "safeMint",
      abi: [
        {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"uri","type":"string"}],"name":"safeMint","outputs":[],"stateMutability":"payable","type":"function",},
      ],
      params: {
        to: account,
        // to: "0xDe99498a595AB4e49fd54cD2aA5f71549e4f24c0",
        uri: uri,
        // uri: "https://ipfs.moralis.io:2053/ipfs/QmZEAjVpQSC6onTaLe1pxWA3eA9kgwX1YPkxhPZ694P2pt"
      }, 
      msgValue: Moralis.Units.ETH(0.000001),
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        alert("Succesful Mint");
        setText("");
        setTitle("");
      },
      onError: (error) => {
        alert(error.message);
        console.log(error.message);
        console.log(error);
      },
    });

  }

  const uploadFile = async (event) => {
    event.preventDefault();
    const textArray = text.split();
    const metadata = {
      title,
      text: textArray,
    };

    try {
      const result = await saveFile(
        "myblog.json",
        { base64: btoa(JSON.stringify(metadata)) },
        {
          type: "base64",
          saveIPFS: true,
        }
      );
      // alert(result.ipfs());
      //jetzt wird alert als function genutzt
      const nftResult = await uploadNftMetada(result.ipfs());
      // alert(nftResult.ipfs()) 
      await mint(account, nftResult.ipfs());
    } catch (error) {
      alert(error.message);
      console.log(error.message);
      console.log(error);
    }

  }

  const uploadNftMetada = async (url) => {
    const metadataNft = {
      image:
        "https://ipfs.moralis.io:2053/ipfs/QmXaRnHiDJGZuqSTKFU1aNcSiyRWJmAJGA4Koo3yrgJqMz/Goku",
      description: title,
      externalUrl: url,
    };
    const resultNft = await saveFile(
      "metadata.json",
      { base64: btoa(JSON.stringify(metadataNft)) },
      {
        type: "base64",
        saveIPFS: true,
      }
    );
    return resultNft;
  };

      
  return (
    <>
    <div>
      <form onSubmit={uploadFile} className="writeForm">
        <div className="writeFormGroup">
        <input
            className="writeInput"
            placeholder="Title"
            type="text"
            autoFocus={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
        <textarea
            className="writeInput writeText"
            placeholder="Tell your story..."
            autoFocus={true}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
</>
);
};

export default NewStory;
