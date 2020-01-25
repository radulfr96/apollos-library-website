using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyLibrary.Common.Requests;
using MyLibrary.Common.Responses;
using Newtonsoft.Json;
using NLog;

namespace MyLibrary.Website.Controllers.api
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private HttpClient _httpClient;
        private IConfiguration _configuration;
        private Logger _logger = LogManager.GetCurrentClassLogger();

        public UserController(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = clientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);

        }

        [HttpGet("")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, "api/user");
                var restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetUsersResponse response = JsonConvert.DeserializeObject<GetUsersResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive users");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Post, "api/user/login");
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                restRequest.Content = content;
                var restResponse = await _httpClient.SendAsync(restRequest);
                LoginResponse response = JsonConvert.DeserializeObject<LoginResponse>(await restResponse.Content.ReadAsStringAsync());

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    return Ok(response);
                }
                else if (response.StatusCode == HttpStatusCode.Accepted)
                {
                    return Accepted();
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest)
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to login user.");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}