import { RedFlagsWithLine, TranscriptLine } from "../../types";
import PlayIcon from "../../assets/play.svg?react";
import { useLocationHash } from "../../hooks/useHash";

const TranscriptLineComponent = ({
  line,
  speakers,
  setPlayback,
  transcriptLineId,
  redFlagsWithLine,
}: {
  line: TranscriptLine;
  speakers: string[];
  setPlayback: (timestampInSeconds: number) => void;
  transcriptLineId: number;
  redFlagsWithLine: RedFlagsWithLine[];
}) => {
  const [locationHash] = useLocationHash();
  const focused = locationHash === `#transcript-line-${transcriptLineId}`;

  const speakerId = speakers.indexOf(line.speaker);

  const redFlagsForLine = redFlagsWithLine.filter(
    (redFlagWithLine) => redFlagWithLine.transcriptLineId === transcriptLineId
  );

  const lineWithRedFlagHighlighting = redFlagsForLine.reduce(
    (line, redFlagForLine) => {
      return line.replace(
        redFlagForLine.redFlag.utterance,
        `<span class='red-flag-inline'>${redFlagForLine.redFlag.utterance}</span>`
      );
    },
    line.utterance
  );

  return (
    <div
      id={`transcript-line-${transcriptLineId}`}
      className={`flex flex-col gap-2 rounded p-4 py-2 text-start max-w-prose scroll-p-8 ${
        speakerId === 0
          ? "speaker-a bg-cyan-100"
          : "speaker-b bg-fuchsia-100" /* Here we could look to support more than 2 speakers */
      } ${focused ? "outline-2 outline-blue-500 shadow-lg" : ""}`}
    >
      <div>
        <p className="font-medium">{line.speaker}</p>
        <p
          dangerouslySetInnerHTML={{ __html: lineWithRedFlagHighlighting }}
        ></p>
      </div>
      <div className="self-end">
        <button
          className="rounded-full outline-blue-400 p-1 hover:cursor-pointer hover:outline hover:shadow-lg hover:bg-white"
          onClick={() => {
            setPlayback(line.timestampSeconds);
          }}
        >
          <PlayIcon className="fill-blue-800 h-[1rem] w-[1rem] group-hover:shadow-lg" />
        </button>
      </div>
    </div>
  );
};

export const Transcript = ({
  transcript,
  redFlagsWithLine,
  setPlayback,
}: {
  transcript: TranscriptLine[];
  redFlagsWithLine: RedFlagsWithLine[];
  setPlayback: (timestampInSeconds: number) => void;
}) => {
  const speakers = transcript.reduce((speakers, line) => {
    if (!speakers.includes(line.speaker)) {
      return [...speakers, line.speaker];
    } else {
      return speakers;
    }
  }, [] as string[]);

  return (
    <div className="flex-1 flex flex-col gap-2 bg-white p-4">
      {transcript.map((line, i) => (
        <TranscriptLineComponent
          key={i}
          line={line}
          speakers={speakers}
          setPlayback={setPlayback}
          transcriptLineId={i}
          redFlagsWithLine={redFlagsWithLine}
        />
      ))}
    </div>
  );
};
