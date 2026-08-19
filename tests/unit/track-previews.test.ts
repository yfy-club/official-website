import { describe, expect, it } from "vitest";

import { tracks } from "@/content";
import { buildTrackPreviews, getTrackPreview, TRACK_EXAMPLE_PREVIEWS } from "@/lib/track-previews";

describe("track preview mapping", () => {
  it("maps each track to its verified standard domain example preview image", () => {
    const aiTrack = tracks.find((t) => t.slug === "ai")!;
    const softwareTrack = tracks.find((t) => t.slug === "software")!;
    const databaseTrack = tracks.find((t) => t.slug === "database")!;
    const cloudIotTrack = tracks.find((t) => t.slug === "cloud-iot")!;
    const industrialTrack = tracks.find((t) => t.slug === "industrial")!;

    const aiPreview = getTrackPreview(aiTrack);
    expect(aiPreview).toEqual(TRACK_EXAMPLE_PREVIEWS.ai);

    const softwarePreview = getTrackPreview(softwareTrack);
    expect(softwarePreview).toEqual(TRACK_EXAMPLE_PREVIEWS.software);

    const databasePreview = getTrackPreview(databaseTrack);
    expect(databasePreview).toEqual(TRACK_EXAMPLE_PREVIEWS.database);

    const cloudIotPreview = getTrackPreview(cloudIotTrack);
    expect(cloudIotPreview).toEqual(TRACK_EXAMPLE_PREVIEWS["cloud-iot"]);

    const industrialPreview = getTrackPreview(industrialTrack);
    expect(industrialPreview).toEqual(TRACK_EXAMPLE_PREVIEWS.industrial);
  });

  it("builds the complete track previews list maintaining track order with all previews present", () => {
    const previews = buildTrackPreviews(tracks);
    expect(previews).toHaveLength(5);
    expect(previews.map((p) => p.slug)).toEqual(["ai", "software", "database", "cloud-iot", "industrial"]);
    expect(previews[0].preview?.title).toBe("神经网络与大模型算法架构");
    expect(previews[4].preview?.title).toBe("工业 4.0 数字孪生与智能制造");
  });
});
