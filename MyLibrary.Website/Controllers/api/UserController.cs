using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyLibrary.Common.Responses;
using Newtonsoft.Json;

namespace MyLibrary.Website.Controllers.api
{
    [Route("api/User")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IHttpClientFactory _clientFactory;
        private IConfiguration _configuration;

        public UserController(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, _configuration.GetSection("BaseApiUrl").Value + "api/user");
                var client = _clientFactory.CreateClient();
                var restResponse = await client.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetUsersResponse response = (GetUsersResponse)JsonConvert.DeserializeObject(restResponse.Content.ToString());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}