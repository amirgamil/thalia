import styled, { keyframes } from "styled-components";

const db70 = keyframes`
    16.67% {
        background-size: 8px 30%, 8px 30%, 8px 50%, 8px 50%, 8px 50%, 8px 50%;
    }
    33.33% {
        background-size: 8px 30%, 8px 30%, 8px 30%, 8px 30%, 8px 50%, 8px 50%;
    }
    50% {
        background-size: 8px 30%, 8px 30%, 8px 30%, 8px 30%, 8px 30%, 8px 30%;
    }
    66.67% {
        background-size: 8px 50%, 8px 50%, 8px 30%, 8px 30%, 8px 30%, 8px 30%;
    }
    83.33% {
        background-size: 8px 50%, 8px 50%, 8px 50%, 8px 50%, 8px 30%, 8px 30%;
    }
`;

export const db71 = keyframes`
    20% {
        left: 0px;
    }
    
    40% {
        left: calc(50% - 4px);
    }
    
    60% {
        left: calc(100% - 8px);
    }
    80%,
    100% {
        left: 100%;
    }
`;

const Container = styled.div`
    width: 40px;
    height: 40px;
    --c: linear-gradient(currentColor 0 0);
    background: var(--c) 0 0, var(--c) 0 100%, var(--c) 50% 0, var(--c) 50% 100%, var(--c) 100% 0, var(--c) 100% 100%;
    background-size: 8px 50%;
    background-repeat: no-repeat;
    animation: ${db70} 1s infinite;
    position: relative;
    overflow: hidden;

    &:before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        top: calc(50% - 4px);
        left: -8px;
        animation: inherit;
        animation-name: ${db71};
    }
`;

export const Spinner = () => {
    return <Container className="dots-bars-7"></Container>;
};
