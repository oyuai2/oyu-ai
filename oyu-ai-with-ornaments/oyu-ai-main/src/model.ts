import * as tf from "@tensorflow/tfjs";
export type BrowserModel = tf.LayersModel;
export type ModelState = {
  ready: boolean;
  labels: string[];
  inputSize: number;
  model: BrowserModel | null;
};
export async function loadTeachableModel(
  modelUrl: string,
  labels: string[] = [],
  inputSize = 224,
): Promise<ModelState> {
  const model = await tf.loadLayersModel(modelUrl);
  return { ready: true, labels, inputSize, model };
}
export async function loadTeachableFiles(
  files: File[],
  labels: string[],
  inputSize = 224,
): Promise<ModelState> {
  const modelFile = files.find((x) => x.name === "model.json");
  const weights = files.filter((x) => x.name.endsWith(".bin"));
  if (!modelFile || !weights.length) throw new Error("MODEL_FILES_MISSING");
  const model = await tf.loadLayersModel(
    tf.io.browserFiles([modelFile, ...weights]),
  );
  return { ready: true, labels, inputSize, model };
}
export async function predictSource(
  state: ModelState,
  source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
) {
  if (!state.model) throw new Error("MODEL_NOT_LOADED");
  const input = tf.browser
    .fromPixels(source)
    .resizeBilinear([state.inputSize, state.inputSize])
    .toFloat()
    .div(127.5)
    .sub(1)
    .expandDims(0);
  const raw = state.model.predict(input);
  const output = (Array.isArray(raw) ? raw[0] : raw) as tf.Tensor;
  const values = await output.data();
  input.dispose();
  tf.dispose(raw as tf.TensorContainer);
  return Array.from(values, (x) => Number(x))
    .map((probability, index) => ({
      label: state.labels[index] ?? String(index),
      probability,
    }))
    .sort((a, b) => b.probability - a.probability);
}
