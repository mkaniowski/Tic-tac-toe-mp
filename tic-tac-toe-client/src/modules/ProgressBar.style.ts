import styled, { css } from "styled-components"
type Props = {
    progress: any;
}
export const Bar = styled.div<Props>`
    height: 20px;
    width: 75%;
    border-radius: 10px;
    background-color: white;
    margin-top: 2rem;
    margin-bottom: 2rem;
    & > div {
        height: 100%;
        background-color: #186BC9;
        border-radius: 10px;
        transition: width 1s linear;
        ${props => props.progress && css`
            width: ${props.progress}%;
        `};
    }
`