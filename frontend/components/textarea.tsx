import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import styled, { keyframes } from "styled-components";

interface Props {
    setValue: (val: string) => void;
    setIndividualNote: (val: string) => void;
    value: string;
    uneditableText: string;
    isLoading: boolean;
}

const flicker = keyframes`
    0% {
        opacity: 0.5;
    }
    50% {
        opacity: 0.1;
    }
    100% {
        opacity: 0.5;
    }
`;

const Container = styled.div`
    z-index: 40;
    textarea,
    pre {
        width: 100%;
        border: 0px;
        padding: 10px 15px 10px 0;
        min-height: 3.5em;
        line-height: 1.5em;
        margin: 0;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        -webkit-appearance: none;
        border: none;
        outline: none;
        background: transparent;
        font-family: "Inconsolata", monospace;
        word-wrap: break-word;
        white-space: pre-wrap;
    }

    textarea {
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        resize: none;
        position: absolute;
    }

    .loading {
        animation: ${flicker} 3s infinite;
    }

    .processing {
        opacity: 0.5;
    }

    pre {
        color: black;
        z-index: 3;
    }

    .hidden {
        visibility: hidden;
        display: block;
    }
`;

const notify = () =>
    toast("Uh oh, you can't modify the hardwork of previous contributors (i.e. delete committed notes)!", {
        position: "bottom-right",
    });

export const Textarea: React.FC<Props> = ({ value, setValue, setIndividualNote, uneditableText, isLoading }) => {
    console.log("loading: ", isLoading);
    return (
        <Container className="w-full relative my-4">
            <pre>{uneditableText}</pre>
            <textarea
                id="textarea"
                className={`text-s z-2 ${isLoading ? "loading" : "processing"}`}
                placeholder="Click here and start typing to make a tune (sound on)!"
                value={value}
                onKeyDown={(evt) => setIndividualNote(evt.key)}
                onKeyUp={() => setIndividualNote("")}
                onChange={(evt) =>
                    evt.target.value.startsWith(uneditableText) ? setValue(evt.target.value) : notify()
                }
            ></textarea>
            <div className="hidden">{value}</div>
            <Toaster />
        </Container>
    );
};
