using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NLog;

namespace MyLibrary.Website.Controllers
{
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        protected HttpClient _httpClient;
        protected IConfiguration _configuration;
        protected Logger _logger = LogManager.GetCurrentClassLogger();

        public BaseApiController(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = clientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);

        }

        protected string GetToken()
        {
            try
            {
                return string.IsNullOrEmpty(Request.Cookies["token"]) ? "" : Request.Cookies["token"];
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive auth token.");
                return "";
            }
        }
    }
}