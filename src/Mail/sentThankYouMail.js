const nodemailer = require('nodemailer');
require('dotenv').config();

const sendThankYouEmail = async (email, username) => {
    console.log(`Attempting to send email to ${email}`);
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            // port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: "ecommerce1mernstack@gmail.com",
                pass: "zzigmstvysshpjnn",
            },
        });

        let mailOptions = {
            from: 'ecommerce1mernstack@gmail.com',
            to: email,
            subject: "Welcome to Our Platform!",
            html: `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]>
<xml><w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"><w:DontUseAdvancedTypographyReadingMail/></w:WordDocument>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml>
<![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;200;300;400;500;600;700;800;900" rel="stylesheet" type="text/css"><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		sup,
		sub {
			font-size: 75%;
			line-height: 0;
		}

		@media (max-width:700px) {
			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-1 .column-1 .block-3.spacer_block {
				height: 45px !important;
			}

			.row-1 .column-1 .block-5.heading_block h1 {
				font-size: 33px !important;
			}

			.row-1 .column-1 .block-6.heading_block h2 {
				font-size: 16px !important;
			}

			.row-1 .column-1 .block-9.paragraph_block td.pad {
				padding: 10px 15px 15px !important;
			}
		}
	</style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub { mso-text-raise:-10% }</style> <![endif]-->
</head>

<body class="body" style="background-color: #fdeef1; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fdeef1;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #111827; background-size: auto;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #111827; background-size: auto; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/8676/Main-Bcgk.png'); background-position: top center; background-repeat: no-repeat; color: #000000; width: 680px; margin: 0 auto;" width="680">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">
													<div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-2" style="height:60px;line-height:60px;font-size:1px;">&#8202;</div>
													<div class="spacer_block block-3" style="height:75px;line-height:75px;font-size:1px;">&#8202;</div>
													<table class="image_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
																<div class="alignment" align="center">
																	<div style="max-width: 170px;"><a href="http://localhost:5173/" target="_blank" style="outline:none" tabindex="-1"><img src="https://68438db55b.imgdist.com/pub/bfra/mbrnypb9/zis/e3j/2km/Black%20Beige%20Modern%20Aesthetic%20Floral%20Initial%20Clothing%20Store%20Logo.png" style="display: block; height: auto; border: 0; width: 100%;" width="170" alt="logo-dark-image" title="logo-dark-image" height="auto"></a></div>
																</div>
															</td>
														</tr>
													</table>
													<table class="heading_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-top:10px;text-align:center;width:100%;">
																<h1 style="margin: 0; color: #2c2b2b; direction: ltr; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 1.5; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 57px;"><span class="tinyMce-placeholder" style="word-break: break-word;">THANK YOU!</span></h1>
															</td>
														</tr>
													</table>
													<table class="heading_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:10px;text-align:center;width:100%;">
																<h2 style="margin: 0; color: #454545; direction: ltr; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; font-size: 22px; font-weight: 400; letter-spacing: normal; line-height: 1.2; text-align: center; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 26px;"><span class="tinyMce-placeholder" style="word-break: break-word;">FOR YOUR REGISTERATION!</span></h2>
															</td>
														</tr>
													</table>
													<table class="divider_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="55%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #575757;"><span style="word-break: break-word;">&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-8" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div>
													<table class="paragraph_block block-9" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:15px;padding-top:10px;">
																<div style="color:#454545;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:700;letter-spacing:0px;line-height:1.5;text-align:center;mso-line-height-alt:21px;">
																	<p style="margin: 0; margin-bottom: 16px;">We are happy to welcome ${username} to our community.</p>
																	<p style="margin: 0;">We started out to create value for the services you use on a daily basis.<br>We are so glad you joined us on our path to something great!<br><br>with love,<br>TreandHaven & Team</p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-10" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Thank You email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};



module.exports = { sendThankYouEmail };