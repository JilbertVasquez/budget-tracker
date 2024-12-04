
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace budget_tracker_client.Users
{
    [Table("users")]
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; } = default!;

        [Required, EmailAddress]
        public string Email { get; set; } = default!;

        [Required]
        public string Username { get; set; } = default!;

        [Required]
        public string Password { get; set; } = default!;

        public DateTime? CreatedAt { get; set; }

        public bool? IsDeleted { get; set; }

        public User() { }

        public User(RegisterUserDto dto)
        {
            Name = dto.Name;
            Email = dto.Email;
            Username = dto.Username;
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password, 11);
            CreatedAt = DateTime.Today;
        }
    }
}