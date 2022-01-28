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
}

export const Button: React.FC<Props> = ({ onClick }: Props) => {
    return (
        <Container className="my-10 w-full flex justify-center">
            <button onClick={onClick} className="border p-3">
                Create
            </button>
        </Container>
    );
};
