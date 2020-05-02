using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MyLibrary.Common.Requests;
using MyLibrary.Common.Responses;
using Newtonsoft.Json;

namespace MyLibrary.Website.Controllers
{
    [Route("api/[controller]")]
    public class AuthorController : BaseApiController
    {
        public AuthorController(IHttpClientFactory clientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(clientFactory, configuration, httpContextAccessor)
        {
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);
        }

        /// <summary>
        /// Used to add a author
        /// </summary>
        /// <returns>Response used to indicate the result</returns>
        [HttpPost("")]
        public async Task<IActionResult> AddAuthor([FromBody] AddAuthorRequest request)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Post, "api/author");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                restRequest.Content = content;
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    AddAuthorResponse response = JsonConvert.DeserializeObject<AddAuthorResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to add author.");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to get all authors
        /// </summary>
        /// <returns>The response with the authors</returns>
        [HttpGet("")]
        public async Task<IActionResult> GetAuthors()
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, "api/author");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetAuthorsResponse response = JsonConvert.DeserializeObject<GetAuthorsResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive authors");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to get an author
        /// </summary>
        /// <returns>The response with the author</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuthor([FromRoute] int id)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, $"api/author/{id}");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetAuthorResponse response = JsonConvert.DeserializeObject<GetAuthorResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive the author");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to update a author
        /// </summary>
        /// <returns>Response used to indicate the result</returns>
        [HttpPatch("")]
        public async Task<IActionResult> UpdateAuthor([FromBody] UpdateAuthorRequest request)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Patch, "api/author");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                restRequest.Content = content;
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    BaseResponse response = JsonConvert.DeserializeObject<BaseResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to update author");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to delete a author
        /// </summary>
        /// <returns>Response used to indicate the result</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor([FromRoute] int id)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Delete, $"api/author/{id}");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    BaseResponse response = JsonConvert.DeserializeObject<BaseResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to delete author");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }
    }
}