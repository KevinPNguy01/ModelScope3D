import React, { createContext } from "react";

export const FileContext = createContext({
    objFile: null as File | null,
    setObjFile: (() =>{}) as React.Dispatch<React.SetStateAction<File | null>>,
    mtlFile: null as File | null,
    setMtlFile: (() =>{}) as React.Dispatch<React.SetStateAction<File | null>>,
    stlFile: null as File | null,
    setStlFile: (() =>{}) as React.Dispatch<React.SetStateAction<File | null>>,
    textureFiles: [] as File[],
    setTextureFiles: (() =>{}) as React.Dispatch<React.SetStateAction<File[]>>
});