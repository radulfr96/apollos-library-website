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
        protected IHttpContextAccessor _httpContextAccessor;

        public BaseApiController(IHttpClientFactory clientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpClient = clientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);
            _httpContextAccessor = httpContextAccessor;

        }

        protected string GetToken()
        {
            try
            {
                return _httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type  == "Token").Value;
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive auth token.");
                return "";
            }
        }
    }
}