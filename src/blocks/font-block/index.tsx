import { FileBlockProps } from "@githubnext/utils";
import { Box } from "@primer/react";
import { useEffect, useState } from "react";

const SUPPORTED_EXTENSIONS = ["ttf"];

const FontPreviewComponent = (props: { filename: string; url: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        <Box
          borderColor="border.default"
          borderWidth={1}
          borderStyle="solid"
          borderRadius={6}
          overflow="hidden"
        >
          Loading font...
        </Box>
      </Box>
    );
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
          <span style={{ fontFamily: `'"${filename}"` }}>
            The quick brown fox jumped over the lazy dog
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
    const url = `https://github.com/${context.owner}/${context.repo}/blob/${context.sha}/${context.path}?raw=true`;

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
