"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type RecordingState = "idle" | "recording" | "recorded" | "transcribing";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export default function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [showHint, setShowHint] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !navigator.mediaDevices?.getUserMedia) {
      setSupported(false);
    }
  }, []);

  // Cleanup on unmount or navigation
  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function formatDuration(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function startRecording() {
    setError(null);
    setShowHint(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, { type: mimeType });

        if (duration < 1) {
          setError("Recording too short. Please record at least 1 second.");
          setRecordingState("idle");
          setDuration(0);
          return;
        }

        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
        setRecordingState("recorded");
      };

      recorder.start(250);
      setDuration(0);
      setRecordingState("recording");

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Microphone access was denied. To enable it, click the lock/camera icon in your browser's address bar and allow microphone access, then try again."
        );
      } else {
        setError("Could not access microphone. Please check your device settings.");
      }
    }
  }

  function stopRecording() {
    stopTimer();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  function discardRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    audioBlobRef.current = null;
    setDuration(0);
    setRecordingState("idle");
    setError(null);
  }

  const handleUseRecording = useCallback(async () => {
    if (!audioBlobRef.current) return;

    setRecordingState("transcribing");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlobRef.current, "recording.webm");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Transcription failed");
      }

      const data = await res.json();

      if (!data.transcription) {
        throw new Error("No speech detected. Please try again.");
      }

      onTranscription(data.transcription);

      // Clean up
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioBlobRef.current = null;
      setRecordingState("idle");
      setDuration(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
      setRecordingState("recorded");
    }
  }, [audioUrl, onTranscription]);

  if (!supported) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
        Voice recording is not supported in this browser. Please type your answer instead.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Hint on first view */}
      {showHint && recordingState === "idle" && (
        <p className="text-xs text-indigo-600">
          You can also answer by voice
        </p>
      )}

      {/* Idle state — mic button */}
      {recordingState === "idle" && (
        <button
          onClick={startRecording}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 active:bg-slate-100 sm:px-3 sm:py-2"
          title="Record voice answer"
        >
          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
          Record Answer
        </button>
      )}

      {/* Recording state */}
      {recordingState === "recording" && (
        <div className="flex items-center gap-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          {/* Pulsing red indicator */}
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
          </span>

          <span className="text-sm font-medium text-rose-700 tabular-nums">
            {formatDuration(duration)}
          </span>

          <span className="text-sm text-rose-600">Recording...</span>

          <button
            onClick={stopRecording}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm transition-colors hover:bg-rose-700 sm:h-9 sm:w-9"
            title="Stop recording"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>
        </div>
      )}

      {/* Recorded state — playback + actions */}
      {recordingState === "recorded" && audioUrl && (
        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-slate-700">
              Recording complete ({formatDuration(duration)})
            </span>
          </div>

          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={audioUrl} controls className="w-full" />

          <div className="flex gap-3">
            <button
              onClick={handleUseRecording}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Use This Recording
            </button>
            <button
              onClick={discardRecording}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Re-record
            </button>
          </div>
        </div>
      )}

      {/* Transcribing state */}
      {recordingState === "transcribing" && (
        <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
          <svg className="h-5 w-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium text-indigo-700">
            Transcribing your answer...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
