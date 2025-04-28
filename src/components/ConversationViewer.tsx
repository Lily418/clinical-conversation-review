import { Ref, useRef, useState } from "react";
import audio from "../data/LDC97S62.mp3";
import conversation from "../data/conversation.json";
import { Patient, RedFlag, RedFlagsWithLine, TranscriptLine } from "../types";
import PlayIcon from "../assets/play.svg?react";
import { useLocationHash } from "../hooks/useHash";

const calculateLinesForRedFlags = ({
  redFlags,
  transcript,
}: {
  redFlags: RedFlag[];
  transcript: TranscriptLine[];
}): RedFlagsWithLine[] => {
  return redFlags.map((redFlag) => {
    const lineForFlagIndex = transcript.findIndex((line, index) => {
      return (
        line.timestampSeconds <= redFlag.timestampSeconds &&
        (index === transcript.length - 1 ||
          transcript[index + 1].timestampSeconds > redFlag.timestampSeconds)
      );
    });

    if (lineForFlagIndex === -1) {
      throw new Error("Unable to find timestamp for red flag in transcript");
    }

    return {
      redFlag,
      line: transcript[lineForFlagIndex],
      transcriptLineId: lineForFlagIndex,
    };
  });
};

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
          className="rounded-full hover:cursor-pointer hover:outline outline-blue-400 p-1"
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

const Transcript = ({
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

const RedFlagComponent = ({
  redFlag,
  transcriptLineId,
}: {
  redFlag: RedFlag;
  lineForFlag: TranscriptLine;
  transcriptLineId: number;
}) => {
  const [display, setDisplay] = useState(true);

  const contextWithRedFlagStyling = redFlag.context.replace(
    redFlag.utterance,
    `<span class='red-flag-context'>${redFlag.utterance}</span>`
  );

  return (
    <>
      {display && (
        <li>
          <p
            className=""
            dangerouslySetInnerHTML={{ __html: contextWithRedFlagStyling }}
          ></p>
          <div className="flex flex-row gap-2">
            <a
              href={`#transcript-line-${transcriptLineId}`}
              className="text-blue-500 hover:underline text-xs"
            >
              View
            </a>
            <button
              onClick={
                () =>
                  setDisplay(
                    false
                  ) /* In a real system this would be a network call */
              }
              className="text-blue-500 hover:underline text-xs hover:cursor-pointer"
            >
              Resolve
            </button>
          </div>
        </li>
      )}
    </>
  );
};

const RedFlagsViewer = ({
  redFlagsWithLine,
}: {
  redFlagsWithLine: RedFlagsWithLine[];
}) => {
  return (
    <div className="text-left bg-white rounded-lg p-4 flex flex-col gap-2">
      <div>
        <h2 className="text-2xl">Red Flags</h2>
        <p className="text-base italic">
          These parts of the conversation have been highlighted by our AI model
          as potential indications of clinical risk
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {redFlagsWithLine.map((redFlagWithLine, index) => {
          return (
            <RedFlagComponent
              key={index}
              redFlag={redFlagWithLine.redFlag}
              lineForFlag={redFlagWithLine.line}
              transcriptLineId={redFlagWithLine.transcriptLineId}
            />
          );
        })}
      </ul>
    </div>
  );
};

const Audio = ({ audioRef }: { audioRef: Ref<HTMLAudioElement> }) => {
  return (
    <div className="text-left bg-white p-4 rounded-lg flex flex-col gap-2">
      <h2 className="text-2xl">Playback conversation</h2>
      <audio controls src={audio} ref={audioRef} />
    </div>
  );
};

const PatientInformation = ({ patient }: { patient: Patient }) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg p-4 py-3">
      <div>
        <h2 className="text-2xl">Patient Details</h2>

        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-medium">Name</td>
              <td>{patient.name}</td>
            </tr>
            <tr>
              <td className="font-medium">Date of birth</td>
              <td>{patient.dob.toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="font-medium">Date of surgery</td>
              <td>{patient.surgeryDate.toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
        <a href="#" className="text-blue-500 hover:underline">
          View patient record
        </a>
      </div>
    </div>
  );
};

const ConversationDetails = ({
  audioRef,
  redFlagsWithLine,
}: {
  audioRef: Ref<HTMLAudioElement>;
  redFlagsWithLine: RedFlagsWithLine[];
}) => {
  return (
    <div className="md:sticky top-4 h-min flex flex-col gap-4 max-w-prose md:w-min">
      <CallMeta />
      <PatientInformation
        patient={{
          name: "Sharon Walker",
          dob: new Date("1975-04-03"),
          surgeryDate: new Date("2025-04-28"),
        }}
      />
      <RedFlagsViewer redFlagsWithLine={redFlagsWithLine} />
      <Audio audioRef={audioRef} />
    </div>
  );
};

export const CallMeta = () => {
  const callDate = new Date("2025-04-28T18:43Z");
  return (
    <div className="text-left bg-white rounded-lg p-4 flex flex-col gap-1">
      <h2 className="text-2xl">Date & Time</h2>
      <table className="w-full">
        <tbody>
          <tr>
            <td className="font-medium">Call Date</td>
            <td> {callDate.toLocaleDateString()} </td>
          </tr>
          <tr>
            <td className="font-medium">Call Time</td>
            <td>
              {callDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const ConversationViewer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setPlayback = (timestampInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.play();

      audioRef.current.currentTime = timestampInSeconds;
    }
  };

  const redFlagsWithLine = calculateLinesForRedFlags({
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
