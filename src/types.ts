export type RedFlag = {
  timestampSeconds: number;
  utterance: string;
  riskScore: number;
  context: string;
};

export type TranscriptLine = {
  speaker: string;
  timestampSeconds: number;
  utterance: string;
};

export type Patient = {
  name: string;
  dob: Date;
  surgeryDate: Date;
}

export type RedFlagsWithLine = {
  redFlag: RedFlag;
  line: TranscriptLine;
  transcriptLineId: number
}