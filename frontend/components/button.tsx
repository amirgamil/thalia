import styled from "styled-components";

const Container = styled.div`
    button {
        &:hover {
            transition: 0.7s;
            background: black;
            color: white;
        }
    }
`;

interface Props {
    onClick: (evt: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}

export const Button: React.FC<Props> = ({ onClick, children }: Props) => {
    return (
        <Container className="my-10 w-full flex justify-center z-40">
            <button onClick={onClick} className="border p-3">
                {children}
            </button>
        </Container>
    );
};
