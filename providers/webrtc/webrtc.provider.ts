export const GetUserMedia = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    return stream;
  } catch (e) {
    return { message: "Error Getting User Media" }
  }
}