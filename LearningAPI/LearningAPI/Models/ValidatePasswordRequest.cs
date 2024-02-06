namespace LearningAPI.Models
{
    public class ValidatePasswordRequest
    {   
        public int UserId { get; set; }
        public string OldPassword { get; set; }
    }
}
