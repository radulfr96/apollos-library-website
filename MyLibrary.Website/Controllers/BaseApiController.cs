using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyLibrary.Common.Responses;
using NLog;

namespace MyLibrary.Website.Controllers
{
    /// <summary>
    /// Used as the base for all of the front end api controllers
    /// </summary>
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

        /// <summary>
        /// Used to get the users token
        /// </summary>
        /// <returns>The users token</returns>
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

        /// <summary>
        /// Used to generate a readable and formatted bad request message to return to the user
        /// </summary>
        /// <param name="response">The response with the bad request messages</param>
        /// <returns></returns>
        protected string BuildBadRequestMessage(BaseResponse response)
        {
            string message = string.Empty;
            try
            {
                foreach (string statusMessage in response.Messages)
                    message += statusMessage + "\n";
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to build bad request message.");
                message = string.Empty;
            }

            return message;
        }
    }
}