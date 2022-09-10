import styled from "styled-components"

type Props = {
        ready: any;
}

export const Wrapper = styled.div`
    position: absolute;
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #05040ad8;
    /* background-color: #d4d4d4ff; */
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
`

export const TextBox = styled.div`
    color: white;
    font-size: 8rem;
    padding: 20%;

    -webkit-animation: text-pop-up-top 3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	animation: text-pop-up-top 3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

    @-webkit-keyframes text-pop-up-top {
    0% {
        -webkit-transform: translateY(0);
                transform: translateY(0);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: none;
    }
    25% {
        -webkit-transform: translateY(-30px);
                transform: translateY(-30px);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: 0 1px 0 #cccccc, 0 2px 0 #cccccc, 0 3px 0 #cccccc, 0 4px 0 #cccccc, 0 5px 0 #cccccc, 0 6px 0 #cccccc, 0 7px 0 #cccccc, 0 8px 0 #cccccc, 0 9px 0 #cccccc, 0 50px 30px rgba(0, 0, 0, 0.3);
    }
    75% {
        -webkit-transform: translateY(-30px);
                transform: translateY(-30px);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: 0 1px 0 #cccccc, 0 2px 0 #cccccc, 0 3px 0 #cccccc, 0 4px 0 #cccccc, 0 5px 0 #cccccc, 0 6px 0 #cccccc, 0 7px 0 #cccccc, 0 8px 0 #cccccc, 0 9px 0 #cccccc, 0 50px 30px rgba(0, 0, 0, 0.3);
    }
    100% {
        -webkit-transform: translateY(0);
                transform: translateY(0);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: none;
    }
    }
    @keyframes text-pop-up-top {
    0% {
        -webkit-transform: translateY(0);
                transform: translateY(0);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: none;
    }
    25% {
        -webkit-transform: translateY(-30px);
                transform: translateY(-30px);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: 0 1px 0 #cccccc, 0 2px 0 #cccccc, 0 3px 0 #cccccc, 0 4px 0 #cccccc, 0 5px 0 #cccccc, 0 6px 0 #cccccc, 0 7px 0 #cccccc, 0 8px 0 #cccccc, 0 9px 0 #cccccc, 0 50px 30px rgba(0, 0, 0, 0.3);
    }
    75% {
        -webkit-transform: translateY(-30px);
                transform: translateY(-30px);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: 0 1px 0 #cccccc, 0 2px 0 #cccccc, 0 3px 0 #cccccc, 0 4px 0 #cccccc, 0 5px 0 #cccccc, 0 6px 0 #cccccc, 0 7px 0 #cccccc, 0 8px 0 #cccccc, 0 9px 0 #cccccc, 0 50px 30px rgba(0, 0, 0, 0.3);
    }
    100% {
        -webkit-transform: translateY(0);
                transform: translateY(0);
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        text-shadow: none;
    }
    }
`

