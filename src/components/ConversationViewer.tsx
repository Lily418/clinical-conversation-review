import { useRef } from "react";
import conversation from "../data/conversation.json";
import { RedFlag, RedFlagsWithLine, TranscriptLine } from "../types";
import { Transcript } from "./Transcript/Transcript";
import { ConversationDetails } from "./ConversationDetails/ConversationDetails";

const calculateTranscriptLinesForRedFlags = ({
  redFlags,
  transcript,
}: {
  redFlags: RedFlag[];
  transcript: TranscriptLine[];
}): RedFlagsWithLine[] => {
  return redFlags.map((redFlag) => {
    const transcriptLineForRedFlagIndex = transcript.findIndex(
      (line, index) => {
        return (
          line.timestampSeconds <= redFlag.timestampSeconds &&
          (index === transcript.length - 1 ||
            transcript[index + 1].timestampSeconds > redFlag.timestampSeconds)
        );
      }
    );

    if (transcriptLineForRedFlagIndex === -1) {
      throw new Error("Unable to find timestamp for red flag in transcript");
    }

    return {
      redFlag,
      line: transcript[transcriptLineForRedFlagIndex],
      transcriptLineId: transcriptLineForRedFlagIndex,
    };
  });
};

export const ConversationViewer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setPlayback = (timestampInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.currentTime = timestampInSeconds;
    }
  };

  const redFlagsWithLine = calculateTranscriptLinesForRedFlags({
    redFlags: conversation.redFlags,
    transcript: conversation.transcript,
  });

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col-reverse md:flex-row justify-center relative gap-2 w-full px-4">
        <div>
          <Transcript
            redFlagsWithLine={redFlagsWithLine}
            setPlayback={setPlayback}
            transcript={conversation.transcript}
          />
        </div>
        <ConversationDetails
          audioRef={audioRef}
          redFlagsWithLine={redFlagsWithLine}
        />
      </div>
    </div>
  );
};
