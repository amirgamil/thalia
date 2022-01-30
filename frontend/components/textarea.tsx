import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";

interface Props {
    setValue: (val: string) => void;
    setIndividualNote: (val: string) => void;
    value: string;
    uneditableText: string;
}

const Container = styled.div`
    textarea,
    pre {
        box-sizing: border-box;
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
        opacity: 0.5;
        overflow: hidden;
        resize: none;
        position: absolute;
    }

    pre {
        color: black;
    }

    .hidden {
        visibility: hidden;
    }
`;

const notify = () =>
    toast("Uh oh, you can't modify the hardwork of previous contributors (i.e. delete committed notes)!");

export const Textarea: React.FC<Props> = ({ value, setValue, setIndividualNote, uneditableText }) => {
    console.log("uneditable: ", uneditableText, " actual: ", value);
    return (
        <Container className="w-full relative my-4">
            <pre>{uneditableText}</pre>
            <textarea
                className="text-s"
                placeholder="Start typing to build a tune"
                value={value}
                onKeyDown={(evt) => setIndividualNote(evt.key)}
                onKeyUp={() => setIndividualNote("")}
                onChange={(evt) =>
                    evt.target.value.startsWith(uneditableText) ? setValue(evt.target.value) : notify()
                }
            ></textarea>
            <pre className="hidden">{value}</pre>
            <Toaster />
        </Container>
    );
};
