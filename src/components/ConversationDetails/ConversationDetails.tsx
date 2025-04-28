import { Ref, useState } from "react";
import {
  RedFlag,
  TranscriptLine,
  RedFlagsWithLine,
  Patient,
} from "../../types";
import audio from "../../data/LDC97S62.mp3";

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
      <h2 className="text-2xl">Conversation Playback</h2>
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
        <a onClick={() => {}} className="text-blue-500 hover:underline">
          View patient record
        </a>
      </div>
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

export const ConversationDetails = ({
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
