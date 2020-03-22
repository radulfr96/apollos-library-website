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
    [Route("api/genre")]
    [ApiController]
    public class GenreController : BaseApiController
    {

        public GenreController(IHttpClientFactory clientFactory, IConfiguration configuration, IHttpContextAccessor httpContextAccessor) : base(clientFactory, configuration, httpContextAccessor)
        {
            _httpClient.BaseAddress = new Uri(_configuration.GetSection("BaseApiUrl").Value);
        }

        /// <summary>
        /// Used to add a genre
        /// </summary>
        /// <returns>Response used to indicate the result</returns>
        [HttpPost("")]
        public async Task<IActionResult> AddGenre([FromBody] AddGenreRequest request)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Post, "api/genre");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                restRequest.Content = content;
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetGenresResponse response = JsonConvert.DeserializeObject<GetGenresResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to add genres");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to get all genres
        /// </summary>
        /// <returns>The response with the genres</returns>
        [HttpGet("")]
        public async Task<IActionResult> GetGenres()
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, "api/genre");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetGenresResponse response = JsonConvert.DeserializeObject<GetGenresResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive genres");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to get a genre
        /// </summary>
        /// <returns>The response with the genre</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGenre([FromRoute] int id)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Get, $"api/genre/{id}");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetGenreResponse response = JsonConvert.DeserializeObject<GetGenreResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to retreive genre");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to update a genre
        /// </summary>
        /// <returns>Response used to indicate the result</returns>
        [HttpPatch("")]
        public async Task<IActionResult> UpdateGenre([FromBody] UpdateGenreRequest request)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Patch, "api/genre");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                var content = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8, "application/json");
                restRequest.Content = content;
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetGenresResponse response = JsonConvert.DeserializeObject<GetGenresResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to update genres");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }

        /// <summary>
        /// Used to delete a genre
        /// </summary>
        /// <returns>Response used to indicate the result</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre([FromRoute] int id)
        {
            var restResponse = new HttpResponseMessage();
            try
            {
                var restRequest = new HttpRequestMessage(HttpMethod.Delete, $"api/genre/{id}");
                restRequest.Headers.Add("Authorization", $"Bearer {GetToken()}");
                restResponse = await _httpClient.SendAsync(restRequest);

                if (restResponse.IsSuccessStatusCode)
                {
                    GetGenresResponse response = JsonConvert.DeserializeObject<GetGenresResponse>(await restResponse.Content.ReadAsStringAsync());
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, "Unable to update genres");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
            return new StatusCodeResult((int)restResponse.StatusCode);
        }
    }
}