using Microsoft.AspNetCore.Mvc;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace WebApp.Server.Controllers
{
    [Route("api")]
    [ApiController]
    public class DataController : ControllerBase
    {
        public class PredictRequest
        {
            public float IF { get; set; }
            public float VW { get; set; }
            public float FP { get; set; }
            public float IW { get; set; }
        }

        // Средние значения и стандартные отклонения для нормализации получены из статистики обучающего набора
        private readonly float[] means = { 45.666667F, 141.333333F, 8.638889F, 78.333333F }; // среднее для IW, IF, VW, FP
        private readonly float[] stdDevs = { 1.678363F, 5.145763F, 2.061078F, 21.493530F }; // стандартное отклонение для IW, IF, VW, FP

        private readonly InferenceSession _widthSession;
        private readonly InferenceSession _depthSession;

        public DataController()
        {
            _widthSession = new InferenceSession("model_width.onnx");
            _depthSession = new InferenceSession("model_depth.onnx");
        }

        [HttpPost, Route("calculate")]
        public async Task<IActionResult> Calculate(PredictRequest _input)
        {
            // Порядок столбцов входных данных
            // IW, IF, VW, FP

            // Нормализация входных данных
            var normalizedIW = (_input.IW - means[0]) / stdDevs[0];
            var normalizedIF = (_input.IF - means[1]) / stdDevs[1];
            var normalizedVW = (_input.VW - means[2]) / stdDevs[2];
            var normalizedFP = (_input.FP - means[3]) / stdDevs[3];

            var inputTensor = new DenseTensor<float>([1, 4 ]);
            inputTensor[0, 0] = normalizedIW;
            inputTensor[0, 1] = normalizedIF;
            inputTensor[0, 2] = normalizedVW;
            inputTensor[0, 3] = normalizedFP;

            // Создание словаря с именами входных данных и соответствующими тензорами
            var inputs = new List<NamedOnnxValue>
            {
                NamedOnnxValue.CreateFromTensor("float_input", inputTensor)
            };
            
            // Выполнение предсказания для ширины
            using var widthResults = _widthSession.Run(inputs);
            var width = widthResults.First().AsEnumerable<float>().First();

            // Выполнение предсказания для глубины
            using var depthResults = _depthSession.Run(inputs);
            var depth = depthResults.First().AsEnumerable<float>().First();

            // Возвращение результата
            return Ok(new { Depth = depth, Width = width });
        }
    }
}
