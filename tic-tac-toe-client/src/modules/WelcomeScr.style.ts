import styled from "styled-components"
import { AiOutlineCheck } from "react-icons/ai"

type Props = {
    ready: any;
}

export const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #061a31;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h1 {
        color: white;
        font-size: 4rem;
        cursor: pointer;
        text-shadow: 0px 0px 2px rgba(255, 255, 255, 1);
        transition: all 0.3s ease-in-out;
    }
    h1:hover {
        text-shadow: 0px 0px 4px rgba(255, 255, 255, 1);
    }

    & > div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 20px;
    }

    * {
        font-family: "JetBrains Mono",monospace;
    }
`

export const Btn = styled.button`
    align-items: center;
    appearance: none;
    background-color: #FCFCFD;
    border-radius: 4px;
    border-width: 0;
    box-shadow: 8px 8px 0px -2px rgba(3, 15, 29, 1),#D6D6E7 0 -3px 0 inset;
    box-sizing: border-box;
    color: #36395A;
    cursor: pointer;
    display: inline-flex;
    font-family: "JetBrains Mono",monospace;
    height: 64px;
    justify-content: center;
    line-height: 1;
    list-style: none;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    position: relative;
    text-align: left;
    text-decoration: none;
    transition: box-shadow .15s,transform .15s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    white-space: nowrap;
    will-change: box-shadow,transform;
    font-size: 18px;
    margin-inline: 30px;
    margin-top: 10px;
    margin-bottom: 1rem;
    font-size: 1.5rem;


    &:focus {
    /* box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset; */
    }

    &:hover {
    /* box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset; */
    transform: translateY(-2px);
    }

    &:active {
    box-shadow: #D6D6E7 0 3px 7px inset;
    transform: translateY(2px);
    }
`

export const JoinForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 15%;

    label {
        color: white;
        font-size: 1.75rem;
        margin-top: 1rem;
        margin-bottom: 0.25rem;
    }

    input {
        background-color: #FCFCFD;
        border-radius: 4px;
        border-width: 0;
        box-shadow: 8px 8px 0px -2px rgba(3, 15, 29, 1),#D6D6E7 0 -3px 0 inset;
        color: #36395A;
        padding-inline: .5rem;
        padding-top: .25rem;
        padding-bottom: .25rem;
        font-size: 1.25rem;
        margin-inline: 1rem;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield;
    }

    input:focus {
        outline: none;
    }

    button {
        margin-top: 3rem !important;
    }
`

export const Lobby = styled.div`
    display: flex;
    flex-direction: column !important;
    color: white;

    * {
        overflow-x: visible !important;
    }

    h2 {
        font-size: 1.75rem;
    }

    ul {
        margin-top: 1rem;
        margin-bottom: 1rem;
        list-style-position: outside;
    }

    
    @keyframes blink {50% { color: transparent }}

    .dot { animation: 1s blink infinite }
    .dot:nth-child(2) { animation-delay: 250ms }
    .dot:nth-child(3) { animation-delay: 500ms }
`

export const ReadyIcon = styled(AiOutlineCheck)`
    color: white;
`

export const LiPlayer = styled.li<Props>`
    display: list-item !important;
    list-style-type: ${props => props.ready == true ? "'✅'" : "'❌'"};
    font-size: 1.5rem;
    padding-left: 0.25rem;
`

export const CreateMenu = styled.form`
    display: flex;
    flex-direction: column;
    width: 15%;

    label {
        color: white;
        font-size: 1.75rem;
        margin-top: 1rem;
        margin-bottom: 0.25rem;
    }

    input {
        background-color: #FCFCFD;
        border-radius: 4px;
        border-width: 0;
        box-shadow: 8px 8px 0px -2px rgba(3, 15, 29, 1),#D6D6E7 0 -3px 0 inset;
        color: #36395A;
        padding-inline: .5rem;
        padding-top: .25rem;
        padding-bottom: .25rem;
        font-size: 1.25rem;
        margin-inline: 1rem;
    }

    input:focus {
        outline: none;
    }

    button {
        margin-top: 3rem !important;
    }
`