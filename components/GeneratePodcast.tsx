import { GeneratePodcastProps } from "@/types";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/components/ui/use-toast";

const useGeneratePodcast = (props: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const getAudioUrl = useMutation(api.podcast.getUrl);

  const { toast } = useToast();

  const generatePodcast = async () => {
    setIsGenerating(true);
    props.setAudio("");

    if (!props.voicePrompt) {
      toast({
        title: "Please provide a voiceType to generate podcast",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: props.voiceType,
        input: props.voicePrompt,
      });

      const blob = new Blob([response], { type: "audio/mpeg" });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], filename, { type: "audio/mpeg" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      props.setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      props.setAudio(audioUrl!);
      setIsGenerating(false);

      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error creating a podcast",
        variant: "destructive",
      });
      console.log("Error generating padcast", error);
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          onClick={generatePodcast}
          className="text-16  bg-orange-1 py-4 font-extrabold text-white-1 "
        >
          {isGenerating ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>Generate</>
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
