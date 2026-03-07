using NUnit.Framework;
using Moq;
using Microsoft.Extensions.Logging;
using Relevantz.PhotoValidator.Api.Controllers;
using Relevantz.PhotoValidator.Core.IService;
using FluentValidation;
using Relevantz.PhotoValidator.Common.DTOs.Request;

namespace Relevantz.PhotoValidator.Api.Tests
{
    [TestFixture]
    public class DummyTests
    {
        private Mock<IAuthenticationService> _mockAuthService;
        private Mock<ILogger<AuthenticationController>> _mockLogger;
        private AuthenticationController _controller;

        [SetUp]
        public void Setup()
        {
            _mockAuthService = new Mock<IAuthenticationService>();
            _mockLogger = new Mock<ILogger<AuthenticationController>>();

            // Minimal validator mocks just to satisfy constructor
            var loginValidator = new Mock<IValidator<LoginRequestDto>>();
            var otpValidator = new Mock<IValidator<VerifyOtpRequestDto>>();
            var forgotValidator = new Mock<IValidator<ForgotPasswordRequestDto>>();
            var resetValidator = new Mock<IValidator<ResetPasswordRequestDto>>();
            var changeValidator = new Mock<IValidator<ChangePasswordRequestDto>>();

            _controller = new AuthenticationController(
                _mockAuthService.Object,
                _mockLogger.Object,
                loginValidator.Object,
                otpValidator.Object,
                forgotValidator.Object,
                resetValidator.Object,
                changeValidator.Object
            );
        }

        [Test]
        public void DummyTest_Passes()
        {
            Assert.Pass("Initial dummy setup works.");
        }
    }
}
