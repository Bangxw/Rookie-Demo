import React from 'react'
import { Layout, Row, Col, Menu, Typography, } from 'antd'

import '@styles/main.less';
import { IconFont, } from '@configs/main'
import logo from '@images/logo.png';
import birds1 from '@images/home/slider/birds1.png'
import birds2 from '@images/home/slider/birds2.png'
import hill from '@images/home/slider/hill.png'
import house from '@images/home/slider/house.png'
import sun from '@images/home/slider/sun.png'

export default class Container extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div id="container-wrap">
        <Layout>
          <Layout.Header className="container" id="header">
            <Row>
              <Col span={24}>
                <div className="social-mideal clearfix">
                  <ul className="right">
                    <li><IconFont type="icon-github" /></li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row className="navbar">
              <Col span={4}>
                <a className="navbar-brand" href="index.html"><h1><img alt="logo" src={logo} /></h1></a>
              </Col>
              <Col span={20}>
                <ul className="nav-link right clearfix">
                  <li><a href=""><IconFont type="icon-home" />&nbsp;HOME</a></li>
                  <li><a href=""><IconFont type="icon-blog" />&nbsp;ARTICLES</a></li>
                  <li><a href=""><IconFont type="icon-bookmark" />&nbsp;BOOKMARKS</a></li>
                  <li><a href=""><IconFont type="icon-wupindengji" />&nbsp;SHORTCODES</a></li>
                </ul>
                <div className="search" style={{ display: 'none', }}>
                  <form role="form">
                    <IconFont type={'icon-fangdajing1'}></IconFont>
                    <div className="field-toggle" style={{ display: 'none', }}>
                      <input autoComplete="off" className="search-form" placeholder="Search" type="text" />
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </Layout.Header>

          <Layout.Content id="banner">
            <div className="main-slider container">
              <Typography style={{ width: '400px', marginTop: '200px', float: 'left', }}>
                <Typography.Title>We Are Creative Nerds</Typography.Title>
                <Typography.Paragraph>Boudin doner frankfurter pig. Cow shank bresaola pork loin tri-tip tongue venison pork belly meatloaf short loin landjaeger biltong beef ribs shankle chicken andouille.</Typography.Paragraph>
              </Typography>
              <div className="slider-totem" style={{ float: 'right', }}>
                <img alt="slider image" className="slider-hill" src={hill} />
                <img alt="slider image" className="slider-house" src={house} />
                <img alt="slider image" className="slider-sun" src={sun} />
                <img alt="slider image" className="slider-birds1" src={birds1} />
                <img alt="slider image" className="slider-birds2" src={birds2} />
              </div>
            </div>
          </Layout.Content>
        </Layout>

        <section id="services">
          <div className="container">
            <div className="row">
              <div className="col-sm-4 text-center padding wow fadeIn" data-wow-delay="300ms" data-wow-duration="1000ms">
                <div className="single-service">
                  <div className="wow scaleIn" data-wow-delay="300ms" data-wow-duration="500ms">
                    <img alt="" src="images/home/icon1.png" />
                  </div>
                  <h2>Incredibly Responsive</h2>
                  <p>Ground round tenderloin flank shank ribeye. Hamkevin meatball swine. Cow shankle beef sirloin chicken ground round.</p>
                </div>
              </div>
              <div className="col-sm-4 text-center padding wow fadeIn" data-wow-delay="600ms" data-wow-duration="1000ms">
                <div className="single-service">
                  <div className="wow scaleIn" data-wow-delay="600ms" data-wow-duration="500ms">
                    <img alt="" src="images/home/icon2.png" />
                  </div>
                  <h2>Superior Typography</h2>
                  <p>Hamburger ribeye drumstick turkey, strip steak sausage ground round shank pastrami beef brisket pancetta venison.</p>
                </div>
              </div>
              <div className="col-sm-4 text-center padding wow fadeIn" data-wow-delay="900ms" data-wow-duration="1000ms">
                <div className="single-service">
                  <div className="wow scaleIn" data-wow-delay="900ms" data-wow-duration="500ms">
                    <img alt="" src="images/home/icon3.png" />
                  </div>
                  <h2>Swift Page Builder</h2>
                  <p>Venison tongue, salami corned beef ball tip meatloaf bacon. Fatback pork belly bresaola tenderloin bone pork kevin shankle.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="responsive" id="action">
          <div className="vertical-center">
            <div className="container">
              <div className="row">
                <div className="action take-tour">
                  <div className="col-sm-7 wow fadeInLeft" data-wow-delay="300ms" data-wow-duration="500ms">
                    <h1 className="title">Triangle Corporate Template</h1>
                    <p>A responsive, retina-ready &amp; wide multipurpose template.</p>
                  </div>
                  <div className="col-sm-5 text-center wow fadeInRight" data-wow-delay="300ms" data-wow-duration="500ms">
                    <div className="tour-button">
                      <a className="btn btn-common" href="#">TAKE THE TOUR</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features">
          <div className="container">
            <div className="row">
              <div className="single-features">
                <div className="col-sm-5 wow fadeInLeft" data-wow-delay="300ms" data-wow-duration="500ms">
                  <img alt="" className="img-responsive" src="images/home/image1.png" />
                </div>
                <div className="col-sm-6 wow fadeInRight" data-wow-delay="300ms" data-wow-duration="500ms">
                  <h2>Experienced and Enthusiastic</h2>
                  <p>Pork belly leberkas cow short ribs capicola pork loin. Doner fatback frankfurter jerky meatball pastrami bacon tail sausage. Turkey fatback ball tip, tri-tip tenderloin drumstick salami strip steak.</p>
                </div>
              </div>
              <div className="single-features">
                <div className="col-sm-6 col-sm-offset-1 align-right wow fadeInLeft" data-wow-delay="300ms" data-wow-duration="500ms">
                  <h2>Built for the Responsive Web</h2>
                  <p>Mollit eiusmod id chuck turducken laboris meatloaf pork loin tenderloin swine. Pancetta excepteur fugiat strip steak tri-tip. Swine salami eiusmod sint, ex id venison non. Fugiat ea jowl cillum meatloaf.</p>
                </div>
                <div className="col-sm-5 wow fadeInRight" data-wow-delay="300ms" data-wow-duration="500ms">
                  <img alt="" className="img-responsive" src="images/home/image2.png" />
                </div>
              </div>
              <div className="single-features">
                <div className="col-sm-5 wow fadeInLeft" data-wow-delay="300ms" data-wow-duration="500ms">
                  <img alt="" className="img-responsive" src="images/home/image3.png" />
                </div>
                <div className="col-sm-6 wow fadeInRight" data-wow-delay="300ms" data-wow-duration="500ms">
                  <h2>Experienced and Enthusiastic</h2>
                  <p>Ut officia cupidatat anim excepteur fugiat cillum ea occaecat rump pork chop tempor. Ut tenderloin veniam commodo. Shankle aliquip short ribs, chicken eiusmod exercitation shank landjaeger spare ribs corned beef.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="clients">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div className="clients text-center wow fadeInUp" data-wow-delay="300ms" data-wow-duration="500ms">
                  <p><img alt="" className="img-responsive" src="images/home/clients.png" /></p>
                  <h1 className="title">Happy Clients</h1>
                  <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <br /> Ut enim ad minim veniam, quis nostrud </p>
                </div>
                <div className="clients-logo wow fadeIn" data-wow-delay="600ms" data-wow-duration="1000ms">
                  <div className="col-xs-3 col-sm-2">
                    <a href="#"><img alt="" className="img-responsive" src="images/home/client1.png" /></a>
                  </div>
                  <div className="col-xs-3 col-sm-2">
                    <a href="#"><img alt="" className="img-responsive" src="images/home/client2.png" /></a>
                  </div>
                  <div className="col-xs-3 col-sm-2">
                    <a href="#"><img alt="" className="img-responsive" src="images/home/client3.png" /></a>
                  </div>
                  <div className="col-xs-3 col-sm-2">
                    <a href="#"><img alt="" className="img-responsive" src="images/home/client4.png" /></a>
                  </div>
                  <div className="col-xs-3 col-sm-2">
                    <a href="#"><img alt="" className="img-responsive" src="images/home/client5.png" /></a>
                  </div>
                  <div className="col-xs-3 col-sm-2">
                    <a href="#"><img alt="" className="img-responsive" src="images/home/client6.png" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="footer">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 text-center bottom-separator">
                <img alt="" className="img-responsive inline" src="images/home/under.png" />
              </div>
              <div className="col-md-4 col-sm-6">
                <div className="testimonial bottom">
                  <h2>Testimonial</h2>
                  <div className="media">
                    <div className="pull-left">
                      <a href="#"><img alt="" src="images/home/profile1.png" /></a>
                    </div>
                    <div className="media-body">
                      <blockquote>Nisi commodo bresaola, leberkas venison eiusmod bacon occaecat labore tail.</blockquote>
                      <h3><a href="#">- Jhon Kalis</a></h3>
                    </div>
                  </div>
                  <div className="media">
                    <div className="pull-left">
                      <a href="#"><img alt="" src="images/home/profile2.png" /></a>
                    </div>
                    <div className="media-body">
                      <blockquote>Capicola nisi flank sed minim sunt aliqua rump pancetta leberkas venison eiusmod.</blockquote>
                      <h3><a href="">- Abraham Josef</a></h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6">
                <div className="contact-info bottom">
                  <h2>Contacts</h2>
                  <address>
                    E-mail: <a href="mailto:someone@example.com">email@email.com</a> <br />
                    Phone: +1 (123) 456 7890 <br />
                    Fax: +1 (123) 456 7891 <br />
                  </address>

                  <h2>Address</h2>
                  <address>
                    Unit C2, St.Vincent&apos;s Trading Est., <br />
                    Feeder Road, <br />
                    Bristol, BS2 0UY <br />
                    United Kingdom <br />
                  </address>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div className="contact-form bottom">
                  <h2>Send a message</h2>
                  <form action="sendemail.php" id="main-contact-form" method="post" name="contact-form">
                    <div className="form-group">
                      <input className="form-control" name="name" placeholder="Name" required="required" type="text" />
                    </div>
                    <div className="form-group">
                      <input className="form-control" name="email" placeholder="Email Id" required="required" type="email" />
                    </div>
                    <div className="form-group">
                      <textarea className="form-control" id="message" name="message" placeholder="Your text here" required rows="8"></textarea>
                    </div>
                    <div className="form-group">
                      <input className="btn btn-submit" name="submit" type="submit" value="Submit" />
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="copyright-text text-center">
                  <p>&copy; Your Company 2014. All Rights Reserved.</p>
                  <p>Designed by <a href="http://www.jq22.com" >Themeum</a></p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div >
    )
  }
}
