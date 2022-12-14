import "./Rightbar.css";
import { Input } from "web3uikit";

const Rightbar = () => {
  const trends = [
    {
      text: "Try learn how IPFS works",
    },
    {
      text: "Try to pull Metadata",
    },
    {
      text: "Try learning some new stuff because i dont now, i have so much time and dont know where to spend it",
    },
    {
      text: "...",
    },
  ];

  return (
    <>
      <div className="rightbarContent">
        <Input label="Search" name="Search" prefixIcon="search"></Input>

        <div className="trends">
          What are we learing Today?
          {trends.map((e, i) => {
            return (
              <div key={i} className="trend">
                <div className="trendText">{e.text}</div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
};

export default Rightbar;