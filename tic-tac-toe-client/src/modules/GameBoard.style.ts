import styled from "styled-components"
import { FiCircle, FiX } from "react-icons/fi";

export const Wrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;

`

export const PlayerCol = styled.div`
    display: flex;
    width: 35vw;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const PlayerName = styled.div`
    color: white;
    font-size: 1.5rem;
`
export const MidCol = styled.div`
    span {
        display: flex;
        color: white;
        font-size: 2.5rem;
        justify-content: center;
        align-self: center;
    }
`

export const Board = styled.table`
    margin: 2.5vw;
    width: 25vw;
    height: 25vw;
    text-align: center;
    border-collapse: collapse;
    border-style: hidden;
    table-layout: fixed;
    
    td, th {
        border: 3px solid #FFFFFF;
        padding: 2px 2px;
        cursor: pointer;
        width: calc(25vw / 3);
        height: calc(25vw / 3);
        svg {
            width: 75%;
            height: 75%;
        }
    }
    
    td {
        font-size: 13px;
        color: #FFFFFF;
    }
`

export const SideIndicator = styled.div`
    font-size: 10rem;
    color: white;
`

export const Circle = styled(FiCircle)`
`

export const Cross = styled(FiX)`
`
