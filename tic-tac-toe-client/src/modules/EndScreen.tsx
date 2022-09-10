import { Wrapper, TextBox } from "./EndScreen.style"

const EndScreen = (props: any) => {
    return (
        <Wrapper>
            <TextBox>{ props.end }</TextBox>
        </Wrapper>
    )
}

export default EndScreen