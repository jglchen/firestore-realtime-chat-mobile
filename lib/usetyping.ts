import { useEffect, useState } from "react";

export default function useTyping(){
    const [isTyping, setIsTyping] = useState(false);
    const [countdown, setCountdown] = useState(0);
  
    const startTyping = () => {
      setCountdown(5);
      setIsTyping(true);
    };
  
    const cancelTyping = () => {
       setIsTyping(false);
    };
  
    useEffect(() => {
        let interval: any;
        if (isTyping){
           interval = setInterval(() => {
             setCountdown((c) => c - 1);
           }, 1000);
        }

        if (countdown === 0) {
          setIsTyping(false);
        }
    
        return () => clearInterval(interval);
    }, [isTyping]);
    
    return { isTyping, startTyping, cancelTyping };
}

/*
export default function useTyping(){
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const startTyping = () => {
    setIsKeyPressed(true);
    setCountdown(5);
    setIsTyping(true);
  };

  const stopTyping = () => {
    setIsKeyPressed(false);
  };

  const cancelTyping = () => {
    setCountdown(0);
  };


  useEffect(() => {
      let interval;
      if (!isKeyPressed) {
        interval = setInterval(() => {
          setCountdown((c) => c - 1);
        }, 1000);
      } else if (isKeyPressed || countdown === 0) {
        clearInterval(interval);
      }
  
      if (countdown === 0) {
        setIsTyping(false);
      }
  
      return () => clearInterval(interval);
  }, [isKeyPressed, countdown]);
  
  return { isTyping, startTyping, stopTyping, cancelTyping };
}
*/