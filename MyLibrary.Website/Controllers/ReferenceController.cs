using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyLibrary.Common.Responses;
using Newtonsoft.Json;

namespace MyLibrary.Website.Controllers
{
    [Route("api/[controller]")]
    public class ReferenceController : BaseApiController
    {
        public ReferenceController(IHttpClientFactory clientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(clientFactory, configuration, httpContextAccessor)
        {
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);
        }

        [HttpGet("countries")]
        public async Task<IActionResult> GetCountries()
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, "api/reference/countries");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetCountriesResponse response = JsonConvert.DeserializeObject<GetCountriesResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive countries");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }
    }
}