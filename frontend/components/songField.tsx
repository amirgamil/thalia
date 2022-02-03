import Link from "next/link";
import * as React from "react";
import styled from "styled-components";

export const Container = styled.div`
    border: 1px solid rgb(0, 0, 0, 0.4);
    width: 200px;

    &:hover {
        color: white;
        background: black;
        cursor: grab;
    }
`;

export const SongField: React.FC<{ name: string; id: number }> = ({ name, id }: { name: string; id: number }) => {
    return (
        <Link href={`/song?id=${id}`}>
            <Container className="p-3 my-4 w-full flex flex-col flex-center justify-center">
                <p className="w-full text-center break-words">{id}</p>
                <h4 className="w-full text-center break-words">{name}</h4>
            </Container>
        </Link>
    );
};
