import { FileBlockProps } from "@githubnext/utils";
import { Box, FormControl, Select } from "@primer/react";
import { useEffect, useState } from "react";

const numbersFromOneToN = (n: number): number[] => {
  return [...Array(n).keys()].map((n) => n + 1);
};

const DEFAULT_PREVIEW_TEXT = "The quick brown fox jumps over the lazy dog";
const SUPPORTED_EXTENSIONS = ["ttf"];
const SUPPORTED_FONT_WEIGHTS = ["normal", "bold"];
const SUPPORTED_FONT_SIZES = numbersFromOneToN(100);

const FontPreviewComponent = (props: { filename: string; url: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fontSizeInPx, setFontSizeInPx] = useState<number>(32);
  const [fontWeight, setFontWeight] = useState<string>("normal");

  const { filename, url } = props;

  useEffect(() => {
    const fontFace = new FontFace(filename, `url(${url})`);

    fontFace.load().then((loadedFontFace) => {
      document.fonts.add(loadedFontFace);
      setIsLoading(false);
    });
  });

  if (isLoading) {
    return (
      <Box p={4}>
        <Box>Loading font...</Box>
      </Box>
    );
  } else {
    return (
      <Box p={4}>
        <Box
          borderColor="border.default"
          borderStyle="solid"
          borderWidth={2}
          borderRadius={6}
          display="grid"
          gridGap={3}
          overflow="hidden"
          p={4}
        >
          <FormControl>
            <FormControl.Label>Font size</FormControl.Label>
            <Select
              value={fontSizeInPx.toString()}
              onChange={(event) =>
                setFontSizeInPx(parseInt(event.currentTarget.value))
              }
            >
              {SUPPORTED_FONT_SIZES.map((fontSize) => (
                <Select.Option value={fontSize.toString()}>
                  {fontSize}px
                </Select.Option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormControl.Label>Font weight</FormControl.Label>
            <Select
              value={fontWeight}
              onChange={(event) => setFontWeight(event.currentTarget.value)}
            >
              {SUPPORTED_FONT_WEIGHTS.map((fontWeight) => (
                <Select.Option value={fontWeight.toString()}>
                  {fontWeight}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box textAlign="center" m={4}>
          <span
            contentEditable
            style={{
              fontFamily: `"${filename}"`,
              fontSize: `${fontSizeInPx}px`,
              fontWeight,
            }}
          >
            {DEFAULT_PREVIEW_TEXT}
          </span>
        </Box>
      </Box>
    );
  }
};

export default function (props: FileBlockProps) {
  const { context } = props;

  const filename = Boolean(context.file)
    ? context.file.split(".").shift()
    : undefined;

  const extension = Boolean(context.path)
    ? context.path.split(".").pop()
    : undefined;

  if (filename && extension && SUPPORTED_EXTENSIONS.includes(extension)) {
    const url = `https://cdn.jsdelivr.net/gh/${context.owner}/${context.repo}@${context.sha}/${context.path}`;

    return <FontPreviewComponent url={url} filename={filename} />;
  } else {
    return (
      <Box p={4}>
        <Box
          borderColor="border.default"
          borderWidth={1}
          borderStyle="solid"
          borderRadius={6}
          overflow="hidden"
        >
          This is not a supported file type.
        </Box>
      </Box>
    );
  }
}
